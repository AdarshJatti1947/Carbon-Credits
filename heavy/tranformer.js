const { spawnSync } = require('child_process');
const { readFile } = require('fs/promises');

async function fetch(prompt)
{
  try
  {
    const pythonProcess = spawnSync('python', [
      'D:/CAPSTONE-BACKEND/recommendations/train1.py',
      'get_keys',
      prompt,
      'D:/CAPSTONE-BACKEND/heavy/results.json'
    ]);
    const result = pythonProcess.stdout?.toString()?.trim();
    const error = pythonProcess.stderr?.toString()?.trim();
  
    let buffer = await readFile('D:/CAPSTONE-BACKEND/heavy/results.json');
    buffer = JSON.parse(buffer?.toString());

    if(Object.keys(buffer).length === 0)
    {
      throw new Error("No matches")
    }
    return buffer

  }
  catch(err)
  {
    const buffer = {};
    return buffer;
  }
}

async function train()
{
  try
  {
      const pythonProcess = spawnSync('python', [
      'D:/CAPSTONE-BACKEND/recommendations/train1.py',
      'train',
    ]);

    const result = pythonProcess.stdout?.toString()?.trim();
    const error = pythonProcess.stderr?.toString()?.trim();
    const status = result === 'OK';
    if(status)
    {
      return true;
    }
    else
    {
      throw new Error("could not be trained");
    }

  }
  catch(err)
  {
    return false
  }
}

module.exports = {fetch,train}