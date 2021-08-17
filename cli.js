#! /usr/bin/env node


const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (question) =>
  new Promise((resolve) => readline.question(question, resolve));

const fs = require("fs");

(async () => {
  let name = await question("Datapack Name: ");
  let id = (await question(`ID (${name.replace(" ","_").toLowerCase()}): `)) ||name.replace(" ","_").toLowerCase();
  let desc = await question("Description: ");
  readline.close();

  let dir = process.cwd() + "/"+name;

  if (fs.existsSync(dir)) {
    if (fs.readdirSync(dir).length) {
      console.log(
        "\x1b[31m%s",
        "[Error] A datapack with this name already exists!",
        "\x1b[0m"
      );
      return;
    }
  } else fs.mkdirSync(dir);

  const packMeta = {
    pack: {
      pack_format: 7,
      description: desc
    }
  };
  
  fs.writeFileSync(
    dir + "/pack.mcmeta",
    JSON.stringify(packMeta, null, "  ") + "\n"
  );

  const dataDir = dir+"/"+"data";
  fs.mkdirSync(dataDir);

  const defaultNameDir = dataDir+"/"+"minecraft";
  fs.mkdirSync(defaultNameDir);

  const nameDir = dataDir+"/"+id;
  fs.mkdirSync(nameDir);
  
  const defaultTagDir = defaultNameDir+"/"+"tags";
  fs.mkdirSync(defaultTagDir);

  const defaultTagFuncDir = defaultTagDir+"/"+"functions";
  fs.mkdirSync(defaultTagFuncDir);

  const defaultTagFuncLoad = {
    values:[
      id+":init"
    ]
  };

  fs.writeFileSync(
    defaultTagFuncDir + "/load.json",
    JSON.stringify(defaultTagFuncLoad, null, "  ") + "\n"
  );

  const defaultTagFuncTick = {
    values:[
      id+":main"
    ]
  };

  fs.writeFileSync(
    defaultTagFuncDir + "/tick.json",
    JSON.stringify(defaultTagFuncTick, null, "  ") + "\n"
  );

  const nameFuncDir = nameDir + "/"+"functions";
  fs.mkdirSync(nameFuncDir);

  const nameFuncInit = `say Loaded`;

  fs.writeFileSync(
    nameFuncDir + "/init.mcfunction",
    nameFuncInit + "\n"
  );

  const nameFuncTick = ``;

  fs.writeFileSync(
    nameFuncDir + "/main.mcfunction",
    nameFuncTick + "\n"
  );

  console.log("\x1b[34m%s", "Datapaack created:", dir, "\x1b[0m");
})();
