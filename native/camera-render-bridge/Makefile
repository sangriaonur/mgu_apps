CXX = g++
CXXFLAGS = -std=c++17 -Wall -O2

TARGET = camera_bridge
SRC = src/main.cpp

all: $(TARGET)

$(TARGET): $(SRC)
	$(CXX) $(CXXFLAGS) $(SRC) -o $(TARGET)

clean:
	rm -f $(TARGET)
