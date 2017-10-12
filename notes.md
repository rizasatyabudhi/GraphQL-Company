1. We need to tell GraphQL on how our data is arranged and how it can be accessed, 
   we do this inside the schema file (type of data we use, relations between data) 
2. Root Query = Allow GraphQL to jump and land on a very specific nodde in our graph
3. Resolve function = to resolve the different data between data (field) from DB/API (companyId) with GraphQL Type (our defined schema) (company) 
4. Imagine the resolve as a function that return a connector between table (node). so one resolve function creates one connection between a table