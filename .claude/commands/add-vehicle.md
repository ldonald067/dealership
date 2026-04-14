Add a new vehicle to the dealership inventory. Ask the user for the following details (or use reasonable defaults if they say "just make one up"):

- Year, Make, Model, Trim
- VIN (generate a realistic one if not provided)
- MSRP and sale price
- Residual % and money factor (for lease calculator)
- Exterior/interior color
- Body type (SUV, Sedan, Truck, Coupe, etc.)
- Fuel type (Gas, Hybrid, Electric)

Then insert the vehicle directly into the database using Prisma, or via the API if the dev server is running. Confirm the vehicle was added and show the lease calculator monthly payment estimate.