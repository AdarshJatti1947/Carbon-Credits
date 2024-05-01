async function calculate_emissions(req)
{
  const electricity = req.body.ElectricityConsumtion*0.00044
  const naturalGas = req.body.NaturalGasConsumption*0.0053;
  const oilBarrel = req.body.OilBarrelConsumption*0.43;
  const petrol = req.body.PetrolConsumption*0.0025;
  const diesel = req.body.DieselConsumption*0.0029;
  const total_amount = electricity + naturalGas + oilBarrel + petrol + diesel;
  return total_amount; 
}

module.exports = {calculate_emissions};