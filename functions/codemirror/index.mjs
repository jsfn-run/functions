export default {
  actions: {
    load: {
      output: "dom",
      handler(input, output) {
        const parts = [
          `<script src="https://unpkg.com/codemirror@5.65.13/lib/codemirror.js"></script>`,
          `<link rel="stylesheet" href="https://unpkg.com/codemirror@5.65.13/lib/codemirror.css" />`,
          `<style>.CodeMirror { height: 100% }</style>`,
          `<script>
          window.editors ||= {};
          window.createEditor = async function(target, options) {
            if (options.language) {
              options.mode = options.language;
            }
            
            if (options.mode === 'html') {
              options.mode = 'htmlmixed';
            }
          
            const language = options.mode;

            while(1) {
              if (window.CodeMirror) {
                const e = new CodeMirror(target, options);
                
                if (options.name) {
                  window.editors[options.name] = e;
                }
                
                if (!document.getElementById('lang-' + language)) {
                  const modeScript = document.createElement('script');
                  modeScript.id = 'lang-' + language;
                  modeScript.src = 'https://unpkg.com/codemirror@5.65.13/mode/' + language + '/' + language + '.js';
                  document.head.append(modeScript);
                }

                return e;
              }

              await new Promise(r => setTimeout(r, 1000));
            }
          };

          window.getEditor = async function(name) {
            while (!window.editors[name]) {
                await new Promise(r => setTimeout(r, 1000));
            }

            return window.editors[name];
          }
          </script>`,
        ];

        output.sendText(parts.join(""));
      },
    },
    install: {
      output: "dom",
      handler(input, output) {
        const { target = "", ...options } = input.options;

        if (!target) {
          throw new Error("A target selector is required");
        }

        output.sendText(`<script type="module">
          const target = document.querySelector("${target}");
          if (!target) {
            throw new Error('${target} not found!');
          }
          const options = ${JSON.stringify(options)};
          const editor = await window.createEditor(target, options);
          editor.refresh();
          window.addEventListener('resize', () => editor.refresh());
          target.editor = editor;
          if(options.fontSize) {
            editor.getWrapperElement().style.fontSize = options.fontSize;
          }
          </script>`);
      },
    },
  },
};
