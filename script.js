function createMarkdownLink(file, linksContainer, content) {
    const link = document.createElement('a');
    link.href = `#`;
    link.className = 'block p-2 rounded-md hover:bg-gray-100 text-gray-700';
    link.onclick = e => {
        e.preventDefault();
        fetch(file)
            .then(res => res.text())
            .then(md => {
                const html = marked.parse(md);
                content.innerHTML = html;
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
        });
});