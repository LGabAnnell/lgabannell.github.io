function createMarkdownLink(file, linksContainer, content) {
    const link = document.createElement('a');
    const anchorId = file.replace('.md', '').replace(/\s+/g, '-').toLowerCase();
    link.href = `#${anchorId}`;
    link.className = 'block p-2 rounded-md hover:bg-gray-100 text-gray-700';
    link.onclick = e => {
        e.preventDefault();
        // Update the URL without reloading the page
        history.pushState(null, null, `#${anchorId}`);
        fetch(file)
            .then(res => res.text())
            .then(md => {
                const html = marked.parse(md);
                content.innerHTML = `<section id="${anchorId}">${html}</section>`;
                addCodeSnippetStyling(); // Apply styling to code snippets after loading
            });
    };
    link.textContent = file.replace('.md', '');
    linksContainer.appendChild(link);
}

function filterLinks() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.toLowerCase();
    const links = document.querySelectorAll('#links a');

    links.forEach(link => {
        const linkText = link.textContent.toLowerCase();
        if (linkText.includes(searchTerm)) {
            link.style.display = 'block';
        } else {
            link.style.display = 'none';
        }
    });
}

// Function to add styling and copy button to code snippets
function addCodeSnippetStyling() {
    // Process block code snippets (<pre><code>)
    const blockCodeBlocks = document.querySelectorAll("pre code");

    blockCodeBlocks.forEach((codeBlock) => {
        // Skip if already processed
        if (codeBlock.parentElement.classList.contains("code-snippet-container")) {
            return;
        }

        // Create container div
        const container = document.createElement("div");
        container.className = "code-snippet-container";

        // Create copy button
        const copyButton = document.createElement("button");
        copyButton.className = "copy-button";
        copyButton.textContent = "Copy";
        copyButton.addEventListener("click", () => {
            copyCodeToClipboard(codeBlock, copyButton);
        });

        // Wrap the code block in the container
        codeBlock.parentElement.insertBefore(container, codeBlock);
        container.appendChild(copyButton);
        container.appendChild(codeBlock);
    });

    // Process inline code snippets (<code> not inside <pre>)
    const inlineCodeBlocks = document.querySelectorAll("code:not(pre code)");

    inlineCodeBlocks.forEach((codeBlock) => {
        // Skip if already processed
        if (codeBlock.parentElement.classList.contains("inline-code-snippet-container")) {
            return;
        }

        // Create container div
        const container = document.createElement("span");
        container.className = "inline-code-snippet-container";

        // Create copy button
        const copyButton = document.createElement("button");
        copyButton.className = "copy-button-inline";
        copyButton.textContent = "Copy";
        copyButton.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent triggering parent elements
            copyCodeToClipboard(codeBlock, copyButton);
        });

        // Wrap the code block in the container
        codeBlock.parentElement.insertBefore(container, codeBlock);
        container.appendChild(codeBlock);
        container.appendChild(copyButton);
    });
}

// Function to copy code to clipboard
function copyCodeToClipboard(codeBlock, button) {
    const code = codeBlock.textContent;
    navigator.clipboard
        .writeText(code)
        .then(() => {
            button.textContent = "Copied!";
            setTimeout(() => {
                button.textContent = "Copy";
            }, 2000);
        })
        .catch((err) => {
            console.error("Failed to copy code: ", err);
        });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function () {
    const repo = 'lgabannell.github.io';
    const user = 'lgabannell';
    const content = document.getElementById('markdown-content');
    const searchInput = document.getElementById('search-input');

    searchInput.addEventListener('input', filterLinks);

    fetch(`https://api.github.com/repos/${user}/${repo}/git/trees/main`)
        .then(result => result.json())
        .then(result => result.tree
            .filter(obj => obj.path.endsWith(".md"))
            .filter(obj => !obj.path.startsWith("README"))
            .map(object => object.path)
            .sort()
        )
        .then(mdfiles => {
            const linksContainer = document.getElementById('links');
            mdfiles.forEach(file => {
                createMarkdownLink(file, linksContainer, content);
            });

            // Check if the URL has an anchor and load the corresponding note
            const hash = window.location.hash.substring(1); // Remove the '#' from the hash
            if (hash) {
                const matchingFile = mdfiles.find(file => {
                    const anchorId = file.replace('.md', '').replace(/\s+/g, '-').toLowerCase();
                    return anchorId === hash;
                });

                if (matchingFile) {
                    // Simulate clicking the link to load the content
                    const link = document.querySelector(`a[href="#${hash}"]`);
                    if (link) {
                        link.click();
                    }
                }
            }
        });
});
