/* global NexT, CONFIG, MathJax */

document.addEventListener('page:loaded', () => {
  if (!CONFIG.enableMath) return;

  // 合并默认配置和用户配置
  const defaultTexConfig = {
    inlineMath: [['$', '$']],
    displayMath: [['$$', '$$']]
  };
  const texConfig = CONFIG.mathjax.config && CONFIG.mathjax.config.tex
    ? Object.assign({}, defaultTexConfig, CONFIG.mathjax.config.tex)
    : defaultTexConfig;

  if (typeof MathJax === 'undefined') {
    window.MathJax = {
      tex: texConfig,
      options: {
        renderActions: {
          insertedScript: [200, () => {
            document.querySelectorAll('mjx-container').forEach(node => {
              const target = node.parentNode;
              if (target.nodeName.toLowerCase() === 'li') {
                target.parentNode.classList.add('has-jax');
              }
            });
          }, '', false]
        }
      }
    };
    NexT.utils.getScript(CONFIG.mathjax.js, {
      attributes: {
        defer: true
      }
    });
  } else {
    // 如果 MathJax 已经加载，更新配置并重新渲染
    if (CONFIG.mathjax.config && CONFIG.mathjax.config.tex) {
      Object.assign(MathJax.config.tex, CONFIG.mathjax.config.tex);
    }
    MathJax.startup.document.state(0);
    MathJax.typesetClear();
    MathJax.texReset();
    MathJax.typesetPromise();
  }
});
