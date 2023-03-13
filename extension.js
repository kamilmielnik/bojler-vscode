const { boil, BOILER_DIRECTORY, getTemplates, readTemplate } = require('../bojler');
const vscode = require('vscode');

exports.activate = (context) => {
  console.log('Bojler extension is active.');

  var disposable = vscode.commands.registerCommand('extension.bojler', async (commandContext) => {
    if (typeof commandContext === 'undefined') {
      await vscode.window.showErrorMessage('commandContext is undefined');
      return;
    }

    const templates = await getTemplates();

    if (templates.length === 0) {
      await vscode.window.showErrorMessage(`No templates in ${BOILER_DIRECTORY}`);
      return;
    }

    const templateFilename = await vscode.window.showQuickPick(templates, {
      canPickMany: false,
      title: 'Choose template',
    });

    if (typeof templateFilename === 'undefined') {
      return;
    }

    const template = readTemplate(templateFilename);
    const parameters = {};

    for (const [name, prompt] of Object.entries(template.parameters)) {
      parameters[name] = await vscode.window.showInputBox({ prompt });
    }

    await boil(templateFilename, commandContext.path, parameters);
  });

  context.subscriptions.push(disposable);
};

exports.deactivate = () => {};
