function followPathWithIndex(root, path) {
    let current = root;
  
    for (const step of path) {
      let match = step.match(/^([a-zA-Z0-9\-\._]+)(\[(\d+)\])?$/); // e.g., div[3] or div
      let selector = step;
      let index = 1; // default to first match
  
      if (match) {
        selector = match[1];           // tag or class
        index = match[3] ? Number(match[3]) : 1;
      }
  
      const elements = current.querySelectorAll(':scope > div');
      if (elements.length < index) return null; // not enough matches
      current = elements[index - 1]; // 0-based index
      if (!current) return null;
    }
    return current;
  }
  