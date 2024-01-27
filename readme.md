## Project Scripts

### Starting the Development Server

To start the development server, run the following command:

`npm start` 

This will start the nodemon server and automatically restart it when any changes are made.

### Starting the Production Server

To start the production server, run the following command:

`npm run start:prod` 

This will first compile the TypeScript files using `tsc` and then copy the `views` and `public` folders to the `build` folder. Finally, it will start the Node.js server using `node`.

### Compiling TypeScript

To compile the TypeScript files, run the following command:

`npm run tsc` 

This will compile all the TypeScript files in the `src` folder and output the JavaScript files in the `build` folder.

### Copying Files

To copy the `views` and `public` folders to the `build` folder, run the following command:

`npm run copy-files` 

This command will copy the `views` and `public` folders from the `src` folder to the `build` folder.

### Linting the Code

To lint the code using ESLint, run the following command:

`npm run lint` 

This will check all the TypeScript files in the `src` folder for linting errors.

### Fixing Linting Errors

To fix the linting errors automatically using ESLint, run the following command:

`npm run lint:fix` 

This will fix the linting errors in all the TypeScript files in the `src` folder.


### Login credential for Super Admin
note: the specialty of super admin is this can't be update or remove

username: admin  
password: admin

### Formatting ejs code 
To format ejs code use the plugin `ejs beutify`