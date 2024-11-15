document.addEventListener('DOMContentLoaded', async () => {
    const namespaceSelect = document.getElementById('namespace-select');
    const keyCountLabel = document.getElementById('key-count');
    const refreshBtn = document.getElementById('refresh-btn');
    const clearBtn = document.getElementById('clear-btn');
    const exitBtn = document.getElementById('exit-btn');
    const loader = document.getElementById('loader');

    // Function to toggle loader and buttons
    const toggleLoader = (isLoading) => {
        loader.style.display = isLoading ? 'block' : 'none';
        refreshBtn.disabled = isLoading;
        clearBtn.disabled = isLoading;
        namespaceSelect.disabled = isLoading;
    };

    const namespaces = await window.api.fetchNamespaces();
    namespaces.forEach((ns) => {
        const option = document.createElement('option');
        option.value = ns;
        option.textContent = ns;
        namespaceSelect.appendChild(option);
    });

    const updateKeysCount = async () => {
        const namespace = namespaceSelect.value;
        if (!namespace) return;
        toggleLoader(true);
        try {
            let count = 0;
            do {
                count = await window.api.getKeysCount(namespace);
            } while (count === 0);
            keyCountLabel.textContent = `Keys in Redis: ${count}`;
        } catch (error) {
            alert('Failed to fetch key count. Please try again.');
        } finally {
            toggleLoader(false);
        }
    };

    // Trigger keys count update after namespaces are loaded
    if (namespaces.length > 0) {
        namespaceSelect.value = namespaces[0]; // Select the first namespace by default
        await updateKeysCount();
    }

    namespaceSelect.addEventListener('change', updateKeysCount);

    refreshBtn.addEventListener('click', updateKeysCount);

    clearBtn.addEventListener('click', async () => {
        const namespace = namespaceSelect.value;
        if (!namespace) return;
        toggleLoader(true);
        try {
            await window.api.flushRedis(namespace);
            alert('Redis flushed successfully!');
            await updateKeysCount();
        } catch (error) {
            alert('Failed to flush Redis. Please try again.');
        } finally {
            toggleLoader(false);
        }
    });

    exitBtn.addEventListener('click', () => {
        window.close();
    });
});
