import torch
import torch.nn as nn

class StockLSTM(nn.Module):
    def __init__(self, input_size, hidden_size, num_layers, output_size, dropout):
        super(StockLSTM, self).__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        
        # LSTM layer
        self.lstm = nn.LSTM(input_size=input_size, hidden_size=hidden_size, num_layers=num_layers, batch_first=True)
        
        # GRU layer
        self.gru = nn.GRU(input_size=input_size, hidden_size=hidden_size, num_layers=num_layers, batch_first=True)
        
        # New hidden layer
        self.hidden_layer = nn.Linear(hidden_size * 2, hidden_size)  # Assuming hidden_size is the same as before
        
        self.dropout = nn.Dropout(dropout)
        self.fc = nn.Linear(hidden_size, output_size)  # Output two values for each predicted day (open and close prices)
    
    def forward(self, x):
        h0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(x.device)
        c0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(x.device)
        
        # LSTM forward pass
        lstm_out, _ = self.lstm(x, (h0, c0))
        
        # GRU forward pass
        gru_out, _ = self.gru(x, h0)
        
        # Concatenate LSTM and GRU outputs
        combined_out = torch.cat((lstm_out, gru_out), dim=2)
        
        # Apply dropout
        combined_out = self.dropout(combined_out)
        
        # Apply additional hidden layer
        hidden_out = self.hidden_layer(combined_out[:, -1, :])
        
        # Apply non-linear activation function (e.g., ReLU)
        hidden_out = torch.relu(hidden_out)
        
        # Apply final linear layer
        out = self.fc(hidden_out)
        
        # Reshape output
        out = out.view(out.size(0), -1, 1)
        
        return out