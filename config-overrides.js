let {injectBabelPlugin} = require('react-app-rewired');
let  rewireLess = require('react-app-rewire-less');
/**
 * 
 * @param {webpackconfig} config ->webpack的配置
 * @param {node.env} env ->node 的环境变量
 */
module.exports = function(config,env){
    //执行对config的修改
    config = injectBabelPlugin(['import',{libraryName:'antd',style:true}],config);
    config = rewireLess.withLoaderOptions({
        modifyVars:{"@primary-color":"#1DA57A"}
    })(config,env)
    return config;
}