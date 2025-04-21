# Spark Drag-and-Drop Workflow

An interactive **visual Spark workflow builder** using [Blockly](https://developers.google.com/blockly) and **PySpark**.

## 🔧 Features

- Drag-and-drop blocks to build a Spark data pipeline
- Translate blocks to real PySpark code
- Run Spark jobs with a single click
- Supports flatMap, map, reduceByKey, filter, count, and more

## 🛠️ Tech Stack

- Frontend: React + Blockly
- Backend: Node.js (Express) + Python
- Spark: PySpark local mode
- Communication: REST API

## 📦 Setup

### Prerequisites

- Node.js & npm
- Python 3.10+
- Java (JDK 17+)
- Apache Spark
- Git

### Run locally

```bash
# 1. Clone repo
git clone https://github.com/yourname/spark-blockly-workflow.git
cd spark-blockly-workflow

# 2. Install backend dependencies
cd backend
npm install

# 3. Start backend
node index.js

# 4. Start frontend 
cd frontend/web
npm install
npm run dev


## Example Output

Here’s what the drag-and-drop interface looks like in action:

![Spark Blockly Preview](preview.png)

