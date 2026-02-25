import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset
import time
from tqdm import tqdm

def test_training():
    print("Checking CUDA...")
    if not torch.cuda.is_available():
        print("CUDA NOT AVAILABLE - FAIL")
        return
    
    device = torch.device('cuda')
    print(f"CUDA Available: {torch.cuda.get_device_name(0)}")
    
    # Dummy data
    print("Creating dummy data...")
    x = torch.randn(100, 3, 224, 224)
    y = torch.randint(0, 2, (100,))
    
    ds = TensorDataset(x, y)
    loader = DataLoader(ds, batch_size=10)
    
    # Dummy model
    model = nn.Sequential(
        nn.Conv2d(3, 16, 3),
        nn.ReLU(),
        nn.AdaptiveAvgPool2d((1,1)),
        nn.Flatten(),
        nn.Linear(16, 2)
    ).to(device)
    
    optimizer = optim.SGD(model.parameters(), lr=0.01)
    criterion = nn.CrossEntropyLoss()
    
    print("Starting dummy training loop...")
    model.train()
    
    scaler = torch.cuda.amp.GradScaler()
    
    for epoch in range(3):
        start = time.time()
        for batch_x, batch_y in tqdm(loader, desc=f"Epoch {epoch}"):
            batch_x, batch_y = batch_x.to(device), batch_y.to(device)
            
            optimizer.zero_grad()
            with torch.cuda.amp.autocast():
                output = model(batch_x)
                loss = criterion(output, batch_y)
            
            scaler.scale(loss).backward()
            scaler.step(optimizer)
            scaler.update()
            
        print(f"Epoch {epoch} done in {time.time() - start:.2f}s")
        
    print("Training Test SUCCESS!")

if __name__ == "__main__":
    test_training()
