from math import sqrt

def add1(x: int) -> int:
    return x + 1

def splitCSV(line: str) -> list[str]:
    return line.split() 

def toPair(word: str) -> tuple[str, int]:
    return (word, 1)

def sumInts(a: int, b: int) -> int:
    return a + b

def stdDev(values: list[float]) -> float:
    n = len(values)
    mean = sum(values) / n
    return sqrt(sum((v-mean)**2 for v in values) / n)
