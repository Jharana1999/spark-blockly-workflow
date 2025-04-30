from math   import sqrt, radians, sin, cos, atan2
from typing import Tuple, Any, Optional

def notNone(x):
    return x is not None

def splitText(line: str) -> list[str]:
    return line.split()


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

def parseTicketFlights(line: str) -> Optional[tuple[int, float]]:
    parts = line.strip().split(',')
    if parts[0] == "ticket_no": 
        return None
    try:
        flight_id = int(parts[1])
        amount = float(parts[3])
        return (flight_id, amount)
    except:
        return None


def parseAirports(line: str) -> tuple[str, tuple[float, float]]:
    parts = line.split(',')
    airport_code = parts[0]
    lat = float(parts[3])
    lon = float(parts[4])
    return (airport_code, (lat, lon))

def extractLeft(pair: tuple) -> any:
    return pair[0]

def extractRight(pair: tuple) -> any:
    return pair[1]

def toDepartureKeyVal(line: str) -> tuple[str, int]:
    if "departure_airport" in line:
        return ("__header__", 0)  # mark and exclude later
    try:
        airport = line.split(',')[4]
        return (airport, 1)
    except:
        return ("unknown", 1)
def notHeaderOrUnknown(pair: tuple[str, int]) -> bool:
    return pair[0] not in ("__header__", "unknown")


def toAircraftKeyVal(line: str) -> tuple[str, int]:
    if "aircraft_code" in line:
        return ("__header__", 0)  # skip header
    try:
        return (line.split(',')[7], 1)
    except:
        return ("unknown", 1)
