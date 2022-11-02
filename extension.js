const { boil, BOILER_DIRECTORY, getTemplates, resolvePath } = require('bojler');
const path = require('path');
const vscode = require('vscode');

exports.activate = (context) => {
  console.log('Bojler extension is active.');

  var disposable = vscode.commands.registerCommand('extension.bojler', async (commandContext) => {
    const templates = await getTemplates();

    if (templates.length === 0) {
      await vscode.window.showErrorMessage(`No templates in ${BOILER_DIRECTORY}`);
      return;
    }

    const template = await vscode.window.showQuickPick(templates, {
      canPickMany: false,
      title: 'Choose template',
    });

    if (typeof template === 'undefined') {
      return;
    }

    const name = await vscode.window.showInputBox({
      prompt: 'Enter component name',
    });

    const folderPath = resolvePath(path.join(commandContext.path, name));

    await boil(template, folderPath);
  });

  context.subscriptions.push(disposable);
};

exports.deactivate = () => {};
