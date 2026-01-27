# iGEM26-WP-Tutorial-Basic
> Tutorial for ZJU-China 2026 WP Wiki


## 1 Requirements

- The final version of Wiki should be deployed as a `GitHub Pages Site` before <span style="color:red;">2024.02.24 0:00</span>

- HTML and all sort of source code MUST be committed to the Team Wiki repository on GitHub Repo

- `iframes` are NOT allowed

- On every page, teams must add a clear and visible link to the team GitHub Repo

## 2 Relevant Info

- You can find the requirements for Wiki Pages @ [here](https://competition.igem.org/judging/medals#h-documenting-your-work-on-required-wiki-pages)

- These are URLs for all the Wikis created by ZJU-China:
    > You can visit other team's Wiki by modifiying the LAST part of the URL
    - 2023: <a href="https://2023.igem.wiki/zju-china" target="_blank">Flora Sentinel</a>
    - 2022: <a href="https://2022.igem.wiki/zju-china" target="_blank">StoryLight</a>
    - 2021: <a href="https://2021.igem.org/Team:ZJU-China" target="_blank">ViruGuard</a>
    - 2020: <a href="https://2020.igem.org/Team:ZJU-China" target="_blank">MagHER2some</a>
    - 2019: <a href="https://2019.igem.org/Team:ZJU-China" target="_blank">PaDetector</a>
    - 2018: <a href="https://2018.igem.org/Team:ZJU-China" target="_blank">A Detector</a>
    - 2017: <a href="https://2017.igem.org/Team:ZJU-China" target="_blank">The Guardian Trichoderma</a>
    - 2016: <a href="https://2016.igem.org/Team:ZJU-China" target="_blank">Enigma</a>
    - 2015: <a href="https://2015.igem.org/Team:ZJU-China" target="_blank">Terminator</a>
    - 2014: <a href="https://2014.igem.org/Team:ZJU-China" target="_blank">GeneSocket</a>
    - 2013: <a href="https://2013.igem.org/Team:ZJU-China" target="_blank">The Ghost Kit</a>
    - 2012: <a href="https://2012.igem.org/Team:ZJU-China" target="_blank">RNA Scaffold</a>
    - 2011: <a href="https://2011.igem.org/Team:ZJU-China" target="_blank">Rainbofilm</a>
    - 2010: <a href="https://2010.igem.org/Team:ZJU-China" target="_blank">Bach</a>

- Best Wiki (Nominations) for recent years
  
  - [2023 Grand Jamboree](https://jamboree.igem.org/2023/results?scroll=Best%20Wiki#special-prizes)
  - [2022 Grand Jamboree](https://jamboree.igem.org/2022/results?scroll=Best%20Wiki#special-prizes)
  - [2021 Grand Jamboree](https://jamboree.igem.org/2021/results?scroll=Best%20Wiki#special-prizes)

- [Tutorial](https://gitee.com/igem_ucas_china/2024-drylab-tutorial/tree/master) by UCAS-China (Not Required)

## 3 Repo Structure (@main)

```text
|__ static/              -> static assets (minified CSS & JS files) & some SVGs
|__ wiki/                -> Main directory for the pages and layouts
    |__ footer.html
    |__ menu.html
    |__ layout.html      -> Main layout
    |__ pages/           -> Directory for all the pages
        |__ *.html
|__ .github/
    |__ workflows/              
    |__ build.yml       -> Automated flow for building and deploying 
|__ .gitignore          -> which files/directories should be ignored
|__ README.md           -> File containing the text you are reading right now
|__ app.py              -> Python code managing your wiki
|__ freezer.py          -> Python code for packing
|__ dependencies.txt    -> Software dependencies from the Python code
```

## 4 How to Use

### Preparation

Make sure that: 

- Git, Python3 & Virtualenv has been installed.

- You have a GitHub account.

### Initialize

1. Fork this Repo

> [!IMPORTANT]
>
> 在 fork 时请 **取消勾选** "Copy the `master` branch only" 选项
>
> => 这会导致在首次 push 前缺少 `gh-pages` 分支（问题不大，push 一次之后就会自动创建了）

2. Init Git Pages on branch `gh-pages`

    进入 `Setting->Pages`，在 `Branch` 中选择 `gh-pages` & `/(root)` 并保存修改

### Launch Locally

1. Install

    ```bash
    # clone the repository (with HTTPS)
    # OR you can just download the source code adn the extract it
    git clone [Code->Clone->Copy the Link]

    # create Python Virtual Environment
    cd iGEM24-WP-Tutorial
    python -m venv venv
    . venv/bin/activate     # on Linux, MacOS; or
    . venv\Scripts\activate # on Windows
    ```

2. Launch

    ```bash
    python app.py
    ```
    Then, you can visit the home page @ http://127.0.0.1:8080 or http://localhost:8080.

3. Update

    Simply `Commit & Push`. All the modifications would be automatically to branch:`gh-pages`.

    You can see the result @ `https://{Your Username}.github.io/iGEM24-WP-Tutorial/`

    如果没有及时更新，可以：1. 查看有没有失败的 Action 2. 清空浏览器缓存

## 5 Other Tips

- 使用静态资源

    如果您希望在项目中使用 `/static` 路径下包含的静态资源，请确保引用路径符合以下规范：

    - 使用 `<script>` 标签引入 JS 文件：

        - 声明相对路径

            ```html
            <script src="static/..."></script>
            ```

        - 使用 flask API
        
            ```html
            <script src="{{ url_for('static', filename = '相对 static 的路径')}}"></script>
            ```

    - 使用 `<link>` 标签引入 CSS 文件：

        - 使用 flask API 
            
            ```html
            <link href="{{ url_for('static', filename = '相对 static 的路径')}}" rel="stylesheet">
            ```

    - 在 `<body>` 标签内引入图片文件：

        - 手动声明相对路径

            - `home.html`下：
            
                ```html
                <img src="static/...">
                ```

            - `/wiki/pages` 下的其他文件：
            
                ```html
                <img src="../../static/...">
                ```

        - 使用 flask API（通用）

            ```html
            <img src="{{ url_for('static', filename = '相对 static 的路径')}}">

            <!-- 二级路径用例 -->
            <img src="{{ url_for('static', filename = 'svg/logo.svg')}}">
            ```
    <details><summary>原因详解</summary>

    - 其实是因为 `frozen-flask` 会把项目打包成以下形式：

        ```text
        ├── index.html         # /wiki/pages/home.html
        │
        ├── attributions       # /wiki/pages/ 下的其他页面
        │   └── index.html
        │
        ├── ...
        │
        └── static            # /static 下的静态资源   
           └── ...
        ```
    - flask 框架中的 `{{ url_for('static', filename = '####')}}` 会自动替换为正确链接

    - 手动输入相对链接则需要疯狂调整相对路径

    </details>

- 部署失败

    - 可能原因：由于 `frozen-flask` 的特性，包含 *不存在页面的相对路径* 可能导致打包失败

    - **建议**：
    
        请通过 **注释 `/wiki/pages/menu.html` 中的相对路径** （而非删除 `/wiki/pages` 下的 HTML 文件）来隐藏页面

    - debug 方法：

        - 观察 Actions 中的错误输出

        - 在项目根路径下运行 `python freezer.py`，观察报错信息

- 部署成功后无法即时应用修改

    - 如果 Actions 中显示部署成功，则可能是 *浏览器缓存* 的锅

        => 建议手动清除缓存并刷新页面（或者直接换一个浏览器打开）

    - 可以在项目根路径下执行以下命令：
    
        ```bash
        python freezer.py
        ```

        随后用 live Server 插件打开 `/public/index.html` 文件（项目首页）

        => 如果这里跑起来没问题，那就一定是缓存的锅

### MathJax
> Beautiful and accessible math in all browsers

#### Intro

- 功能简介

    **MathJax** 用于将 Latex 格式的公式转换为 SVG 图片显示，belike 从 `\frac{1}{\pi i}` 变成 $\frac{1}{\pi i}$

    > 事实上它支持非常丰富的 input/output 格式，可以自行爬去 [官网](https://www.mathjax.org/) 康康

- 使用简介

    此处仅介绍 3.0 版本的 CDN 分法版本使用方式

    > 本地 Release 版本的使用教程 & 按需加载就先咕咕了
    >
    > 有兴趣可以自己康康 [3.2 版本的文档](https://www.osgeo.cn/mathjax/index.html)

#### Usage

1. 简单的创建一个 HTML 文件

2. 随便找个角落引入 MathJax 并进行配置

    ```html
    <script>
        MathJax = {
            tex: {
                // 支持 '$' 包裹行内公式，'$$' 包裹块级公式
                inlineMath: [['$', '$']]
            },
            svg: {
                fontCache: 'global'
            }
        };
    </script>
    <!-- 因为国外的 CDN 有点慢，这里胡乱抓了一个国内的 -->
    <script type="text/javascript" id="MathJax-script" async
        src="https://cdn.bootcdn.net/ajax/libs/mathjax/3.2.2/es5/tex-chtml.js">
    </script>
    ```

3. 测试：在 `<body>` 标签内随便打一些公式，观察是否能正常显示

    输入测试文本：

    ```
    $$
        x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
    $$
    ```

    应该显示为:

$$ x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a} $$

5. 开始（并不）愉快地敲公式

    => 符号不会敲可以问浏览器（关键词请用 "Latex 公式"）

    => 也可以试试 VS Code 上的 Latex Workshop 插件
