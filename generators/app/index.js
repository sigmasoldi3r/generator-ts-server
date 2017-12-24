'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const mkdir = require('mkdirp');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.plainCopy = function(file) {
      this.fs.copy(this.templatePath(file), this.destinationPath(file));
    }.bind(this);
    this.dbNames = [
      'PostgreSQL',
      'MySQL',
      'SQLite',
      'Microsoft SQL Server',
      'sql.js',
      'Oracle'
    ];
    this.installableNames = ['pg', 'mysql', 'sqlite3', 'mssql', 'sql.js', 'oracledb'];
    this.typeAcceptedNames = [
      'postgres',
      'mysql',
      'sqlite',
      'mssql',
      'sql.js',
      'oracledb'
    ];
    this.transalteOptions = new Map();
    for (let i = 0; i < this.dbNames.length; i++) {
      this.transalteOptions.set(this.dbNames[i], this.installableNames[i]);
    }
    this.transalteType = new Map();
    for (let i = 0; i < this.dbNames.length; i++) {
      this.transalteType.set(this.dbNames[i], this.typeAcceptedNames[i]);
    }
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the ${chalk.yellow('generator-ts-server')} generator!
This will generate a ${chalk.green('NodeJS')} + ${chalk.red(
        'Express'
      )} server written in ${chalk.blueBright('Typescript')}`)
    );

    const promptPackage = [
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: 'node-backend'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Project description',
        default: 'No description provided'
      },
      {
        type: 'input',
        name: 'license',
        message: 'Project license',
        default: 'MIT'
      },
      {
        type: 'confirm',
        name: 'isPrivate',
        message: 'Is a private project?',
        default: true
      },
      {
        type: 'input',
        name: 'author',
        message: 'Author name [OPTIONAL]'
      },
      {
        type: 'input',
        name: 'email',
        message: 'Author email [OPTIONAL]'
      },
      {
        type: 'input',
        name: 'repo',
        message: 'Enter github repository (format: user/repo-name) [OPTIONAL]'
      }
    ];

    const promptDatabase = [
      {
        type: 'list',
        name: 'db',
        message: 'Choose a database engine (DBMS)',
        choices: this.dbNames
      },
      {
        type: 'input',
        name: 'host',
        message: 'Database host',
        default: 'localhost'
      },
      {
        type: 'input',
        name: 'port',
        message: 'Database engine port',
        default: 5432
      },
      {
        type: 'input',
        name: 'user',
        message: 'Database user name',
        default: 'root'
      },
      {
        type: 'password',
        name: 'password',
        message: "User's password"
      }
    ];

    return this.prompt(promptPackage).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
      this.log(
        yosay(
          `Database configuration time, take your time to choose where to store data!`
        )
      );
      promptDatabase.push({
        type: 'input',
        name: 'name',
        message: 'Enter the database name',
        default: this.props.name
      });
      return this.prompt(promptDatabase).then(props => {
        this.db = props;
        this.db.dbConfig = this.transalteType.get(this.db.db);
      });
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('package.ejs'),
      this.destinationPath('package.json'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('resources/config.ejs'),
      this.destinationPath('resources/config.yml'),
      this.db
    );
    [
      'tsconfig.json',
      'resources/views/error.twig',
      'src/app.ts',
      'src/controllers/api/ApiSampleController.ts',
      'src/controllers/web/SampleController.ts',
      'src/model/User.ts',
      'src/services/UserService.ts',
      'src/repository/UserRepository.ts',
      'resources/views/layout.twig',
      'resources/views/index.twig'
    ].forEach(this.plainCopy);
    mkdir.sync(this.destinationPath('static'));
  }

  install() {
    this.npmInstall();
    // Install database engine
    this.npmInstall([this.transalteOptions.get(this.db.db)], { save: true });
  }
};
