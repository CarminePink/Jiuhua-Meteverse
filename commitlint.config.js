export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat', // 新功能
                'fix', // 修复bug
                'docs', // 文档更新
                'style', // 代码格式（不影响代码运行的变动）
                'refactor', // 重构（既不是新增功能，也不是修改bug的代码变动）
                'perf', // 性能优化
                'test', // 增加测试
                'chore', // 构建过程或辅助工具的变动
                'revert', // 回滚
                'build', // 打包
                'ci', // CI配置相关
                'init' // 代码初始化
            ]
        ],
        'type-case': [2, 'always', 'lower-case'],
        'type-empty': [2, 'never'],
        'scope-empty': [0],
        'scope-case': [0],
        'subject-empty': [2, 'never'],
        'subject-case': [0],
        'subject-full-stop': [0],
        'header-max-length': [2, 'always', 72]
    }
}
