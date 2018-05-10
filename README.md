# myDSI

## Set Environment (process.env)

This app needs defined environment variables to work (case sensitive):
> Be aware some variable are Base64 encoded and may be mutiline.
> New lines are expanded if in double quotes (MULTILINE="new\nline").
> See .env doc:
> <https://github.com/motdotla/dotenv#rules>

* PORT = **number** *Node App will listen to this port*
* MONGO_URI_FULL_BASE64 = **Base64 encoded string** *MongoDB standard URI: mongodb://[username:password@]host1[:port1][/[][database][?options]]*
* EXPRESS_SECRET_BASE64 = **Base64 encoded string** *<https://www.npmjs.com/package/express-session>*
* EXPRESS_HTTPS         = **boolean** *To set if you want to use HTTPS or not, behind a proxy for example*
* REDIRECT_DOMAIN       = **string** *Server's URI: `http://mydomain.fr`*
* SMTP_HOST             = **string** *IP or DNS to connect for SMTP purpose: smtp.ethereal.email*
* SMTP_PORT             = **string** *SMTP port, change boolean if it's a secure port. 25 (no encryption), 465 (SSL), 587 (TLS) for Ethereal*
* SMTP_SECURE           = **boolean** *For Ehtereal SMTP test, put it to false*
* SMTP_USERNAME         = **string** *Username or email address use for authentifcation for SMTP*
* SMTP_PWD_BASE64       = **Base64 encoded string** *Password for SMTP*
* SMTP_FROM             = **string** *Email address to identify FROM field: '"myDSI" <`notifications@my.dsi`>'*
* WEBSITE_NAME          = **string** *Name of your website*

> For more information on MongoDB Connection String:
> <https://docs.mongodb.com/manual/reference/connection-string/>

## Set Dev Environment

### Node.js Installation

This app is developped with Node.js LTS, it can be found here: <https://Node.js.org/en/download/>
You will need admin privileges to install it.

If you use Node.js with an user account on Windows, you may need to set up your PATH environment variable with:

* C:\Program Files\nodejs
* C:\Users\\[YourUserName]\AppData\Roaming\npm

### MongoDB Community Edition 3.6 Installation

This app is developped with MongoDB Community Edition, it can be found here: <https://www.mongodb.com/download-center?jmp=nav#community>

> For more information on MongoDB Cmmunity Edition based on your OS:
> <https://docs.mongodb.com/manual/administration/install-community/>

If you install MongoDB on Windows with the .msi package and you enable Compass during installation, your installation may fail, rollback and shows the following message:
> Setup wizard ended prematurely because of an error. Your system has not been modified. To install this program at a later time run setup wizard again. Click finish button to exit the setup.

It may be due to your PowerShell execution policy defined on "AllSigned". Change it to "RemoteSigned" or install Compass separately.
If it not resolve your issue, you can try to launch MongoDB installer with msiexec:

    msiexec /i mongodb.installer.msi /L*V install.log

> Warning
>
> Do not make exe visible on public networks without running in “Secure Mode” with the auth setting. MongoDB is designed to be run in trusted environments, and the database does not enable “Secure Mode” by default.
>
> Refer to the Security Checklist: <https://docs.mongodb.com/manual/administration/security-checklist/>

#### Configure a Windows Service for MongoDB Community Edition

> Source: <https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/#configure-a-windows-service-for-mongodb-community-edition>

*Open an Administrator PowerShell prompt and execute the remaining steps from this prompt.*

##### Create directories for your database and log files

    mkdir c:\mongodb\data\db
    mkdir c:\mongodb\data\log

##### Create a configuration file

Create a configuration file at c:\mongodb\mongodb.cfg and set it with the following parameters:

    systemLog:
      destination: file
      path: c:\mongodb\data\log\mongodb.log
    storage:
      dbPath: c:\mongodb\data\db
    security:
      authorization: enabled
    net:
      ssl:
        mode: requireSSL
        PEMKeyFile: c:\mongodb\mongodb.pem

##### Create a self-signed certificate

> Source:
<https://docs.mongodb.com/manual/tutorial/configure-ssl/>

If you have Git, you can use OpenSSL directly on Windows to create the self-signed certificate (valid for 365 days):

    openssl req -newkey rsa:2048 -new -x509 -days 365 -nodes -out mongodb-cert.crt -keyout mongodb-cert.key -config "C:\Users\[YourUserName]\AppData\Local\Programs\Git\usr\ssl\openssl.cnf"

Concatenate the certificate and private key to a .pem file:

    Get-Content .\mongodb-cert.* | Set-Content mongodb.pem

Move the file to the desired destination and convert its CRLF to LF with Visual Studio Code or other editor.

    Move-Item -Path mongodb.pem -Destination c:\mongodb\mongodb.pem

##### Install Windows Service

    & 'C:\Program Files\MongoDB\Server\3.6\bin\mongod.exe' --config 'C:\mongodb\mongodb.cfg' --install
    Start-Service MongoDB
    Get-Content C:\mongodb\data\log\mongodb.log -tail 2

Check if MongoDB is running:

    Get-Service MongoDB | Select-Object Status, DisplayName

#### Enable authentication

> Source:
<https://docs.mongodb.com/manual/tutorial/enable-authentication/>

You may need to add MongoDB path to your PATHenvironment variable:

* C:\Program Files\MongoDB\Server\3.6\bin

From a command prompt, connect and create a MongoDB User Administrator:

    mongo --ssl --sslAllowInvalidCertificates
    use admin
    db.createUser(
      {
        user: "userAdmin",
        pwd: "userAdminPassword",
        roles: [{ role: "userAdminAnyDatabase", db: "admin"}]
      }
    )
    exit
    Restart-Service MongoDB

Connect with the new administrator and create an user and database for the app:

    mongo -u userAdmin -p --authenticationDatabase admin --ssl --sslAllowInvalidCertificates
    use mydsi
    db.createUser(
      {
        user: "userApp",
        pwd: "userAppPassword",
        roles: [{ role: "readWrite", db: "mydsi" }]
      }
    )

You can set .env as follow:

    PORT        = 3000
    MONGO_URI   = 'mongodb://userApp:auserAppPassword@localhost/mydsi?ssl=true&connectTimeoutMS=30000'