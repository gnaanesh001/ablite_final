from azure.data.tables import TableClient
from utils import hash_password
from datetime import datetime

conn_str = "DefaultEndpointsProtocol=https;AccountName=agentbridgelitestorage;AccountKey=LRgmtjWpijL7lMwaiHoDvWnY0LA5y3aBWHrSMqkxyHcTkg3Da3C0lvYXsHnn9kYsgF77WOlmNWhm+AStC1vctg==;EndpointSuffix=core.windows.net"

table_name = "AdminAgentBridgeLite"    #this is for AdminTable users
# 
# table_name="UsersAgentBridgeLite"    #this is for UsersTable users
client = TableClient.from_connection_string(conn_str, table_name)

entity = {
    "PartitionKey": "auth",
    "RowKey": "kartik.iyengar@sonata-software.com",
    "HashedPassword": hash_password("admin@123"),
    "UpdatedAt": datetime.utcnow().isoformat()
}

client.upsert_entity(entity)
