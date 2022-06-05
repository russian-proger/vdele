const fs = require('fs');

function SendView(response, view_name) {
    response.send(fs.readFileSync(`${__dirname}/../../views/${view_name}`).toString());
}

module.exports = ({
    SendView
});