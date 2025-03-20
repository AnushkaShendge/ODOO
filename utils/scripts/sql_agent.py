import os
import pymysql
from sqlalchemy import create_engine
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import create_sql_agent
from langchain.agents.agent_toolkits import SQLDatabaseToolkit
from langchain.sql_database import SQLDatabase
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class SmartSearchEngine:
    def __init__(self, host, user, password, database, google_api_key):
        # Set Google API key from environment variable
        os.environ["GOOGLE_API_KEY"] = google_api_key
        
        # Create database connection string
        connection_string = f"mysql+pymysql://{user}:{password}@{host}/{database}"
        
        # Create SQLAlchemy engine and database connection
        self.engine = create_engine(connection_string)
        self.db = SQLDatabase(self.engine)
        
        # Initialize Google Gemini LLM
        self.llm = ChatGoogleGenerativeAI(model="gemini-pro")
        
        # Create SQL agent
        self.agent_executor = self._create_sql_agent()
    
    def _create_sql_agent(self):
        toolkit = SQLDatabaseToolkit(db=self.db, llm=self.llm)
        
        return create_sql_agent(
            llm=self.llm,
            toolkit=toolkit,
            verbose=True,  # Set to True for debugging
            handle_parsing_errors=True
        )
    
    def search(self, query):
        try:
            result = self.agent_executor.invoke({"input": query})
            return result.get('output', 'No results found')
        
        except Exception as e:
            return f"Error: {str(e)}"

def main():
    # Read credentials from .env file
    search_engine = SmartSearchEngine(
        host=os.getenv('DB_HOST', 'localhost'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        database=os.getenv('DB_NAME'),
        google_api_key=os.getenv('GOOGLE_API_KEY')
    )
    
    queries = [
        "give what is the position of murphy diane",
        # Add more queries as needed
    ]
    
    for query in queries:
        print(f"Query: {query}")
        print(search_engine.search(query))

if __name__ == "__main__":
    main()