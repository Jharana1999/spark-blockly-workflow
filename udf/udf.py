from math import sqrt, radians, sin, cos, atan2



def add1(x: int) -> int:
    return x + 1

def splitCSV(line: str) -> list[str]:
    return line.split(',')  

def toPair(word: str) -> tuple[str, int]:
    return (word, 1)

def sumInts(a: int, b: int) -> int:
    return a + b

def stdDev(values: list[float]) -> float:
    n = len(values)
    mean = sum(values) / n
    return sqrt(sum((v-mean)**2 for v in values) / n)

def parseFlights(line: str) -> tuple[int, tuple[str, str]]:
    parts = line.split(',')
    flight_id = int(parts[0])
    dep_airport = parts[4]
    arr_airport = parts[5]
    return (flight_id, (dep_airport, arr_airport))

def parseTicketFlights(line: str) -> tuple[int, float]:
    parts = line.split(',')
    ticket_no = parts[0]
    flight_id = int(parts[1])
    amount = float(parts[3])
    return (flight_id, amount)

def parseAirports(line: str) -> tuple[str, tuple[float, float]]:
    parts = line.split(',')
    airport_code = parts[0]
    lat = float(parts[3])
    lon = float(parts[4])
    return (airport_code, (lat, lon))

def distance(x: tuple[float, float], y: tuple[float, float]) -> float:
    # x = (lat1, lon1), y = (lat2, lon2)
    R = 6373.0  # Earth's radius in km
    lat1 = radians(x[0])
    lon1 = radians(x[1])
    lat2 = radians(y[0])
    lon2 = radians(y[1])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c * 0.621371  # Convert km to miles

def extractLeft(pair: tuple) -> any:
    return pair[0]

def extractRight(pair: tuple) -> any:
    return pair[1]
