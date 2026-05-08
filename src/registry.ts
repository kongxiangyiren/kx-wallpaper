import { checkIfExists, register, deRegister } from 'protocol-registry';
import prompts from 'prompts';

function re() {
  return register(import.meta.env.TSDOWN_PROTOCOL, 'node ' + import.meta.filename + ' "$_URL_"', {
    appName: import.meta.env.TSDOWN_APP_NAME,
    override: true,
    terminal: true
  });
}

async function registry() {
  const exists = await checkIfExists(import.meta.env.TSDOWN_PROTOCOL).catch(e => {
    console.log('查找protocol失败');
    throw new Error(e);
  });

  let result: prompts.Answers<'prompts'>;

  try {
    result = await prompts(
      [
        {
          // 单选
          type: 'select',
          name: 'prompts',
          message: '请选择操作',
          choices: [
            {
              title: '注册',
              value: 'register',
              disabled: exists,
              description: exists ? '已注册' : '注册协议'
            },
            {
              title: '更新',
              value: 'update',
              disabled: !exists,
              description: !exists ? '未注册' : '更新协议'
            },
            {
              title: '注销',
              value: 'deRegister',
              disabled: !exists,
              description: !exists ? '未注册' : '注销协议'
            }
          ]
        }
      ],
      {
        onCancel: () => {
          throw new Error('✖ 操作被取消');
        }
      }
    );
  } catch (error: Error | any) {
    console.log(error.message);
    return;
  }

  switch (result.prompts) {
    case 'register':
      await re().catch(e => {
        console.log('注册失败');
        throw new Error(e);
      });
      console.log('注册成功');
      break;
    case 'update':
      await re().catch(e => {
        console.log('更新失败');
        throw new Error(e);
      });
      console.log('更新成功');
      break;

    case 'deRegister':
      await deRegister(import.meta.env.TSDOWN_PROTOCOL, {
        force: false
      }).catch(e => {
        console.log('注销失败');
        throw new Error(e);
      });
      console.log('注销成功');
      break;
  }
}

export default registry;
