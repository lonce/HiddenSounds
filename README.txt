Install
   Depends on Express and socket.io, so at the command-line prompt:
      npm install express
      npm install socket.io
   The express and socket.io will be put in the node_modules directory.

Now your main directory will look like this:
  node_modules  [folder with the installed libraries]
  www           [folder with files to be served.] 
	               
  nodeServer.js [the server code]


To run the server, at the command prompt:
node nodeServer.js port#

Then open your browser, and type a URL:
	localhost:[port# you provided to node]/file_name ]  (to see files in the www/ subtree)

