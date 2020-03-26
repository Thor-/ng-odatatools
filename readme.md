## Odata V4 Client Generator CLI tool 
This is a fork from this great [package](https://github.com/apazureck/odatatools) developed for vscode.
There are 2 big changes in this fork:
- The generated proxy will be using modules instead of namespaces
- The proxy can be generated with a node-script, so it can easily be integrated into your build process.

With this tool you can generate a client that allows you to easily create typesafe odata queries. 

## Getting started
`npm install --save-dev odatatools-cli`

In your package.json create a task:

`"generate-odata-proxy": "odatatools-cli --outDir=src/api/proxy --endpoint https://services.odata.org/V4/Northwind/Northwind.svc/$metadata"`

After you ran this task a folder should be created with all the required javascript modules. It depends on your odata endpoint which file you need to import to get started.

See this gif below for some examples using the Northwind oData endpoint.

![example](https://raw.githubusercontent.com/erwinsmit/odatatools/master/example.gif) 

More documentation will follow.