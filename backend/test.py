import os, sys

# Add the udf folder to sys.path (for driver)
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../udf")))

# Set environment variables
os.environ["JAVA_HOME"] = r"C:\Program Files\Eclipse Adoptium\jdk-21.0.7.6-hotspot"
os.environ["PYSPARK_PYTHON"] = r"C:\Users\jhara\AppData\Local\Programs\Python\Python311\python.exe"
os.environ["PYSPARK_DRIVER_PYTHON"] = r"C:\Users\jhara\AppData\Local\Programs\Python\Python311\python.exe"

from pyspark.sql import SparkSession
from udf import * 

# Initialize Spark
spark = SparkSession.builder.master("local[*]").appName("BlocklyFlow").getOrCreate()
sc = spark.sparkContext

# Add udf.py so Spark workers can use it
sc.addPyFile("../udf/udf.py")

# Run the word count
rdd = sc.textFile("../data/wordcount.txt")
rdd = rdd.flatMap(splitCSV)
rdd = rdd.map(toPair)
rdd = rdd.reduceByKey(sumInts)
result = rdd

# Output
print("File exists:", os.path.exists("../data/wordcount.txt"))
print("RDD count:", rdd.count())
print("Result preview:", result.take(10))

sys.stdout.flush()
spark.stop()
