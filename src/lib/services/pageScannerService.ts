// Page scanner service to extract information from the current page

interface PageElement {
  tag: string;
  text: string;
  role?: string;
  id?: string;
  className?: string;
}

export const pageScannerService = {
  // Extract important content from the current page
  scanCurrentPage: (): { path: string; title: string; content: string } => {
    try {
      // Get current path
      const path = window.location.pathname;
      
      // Get page title
      const title = document.title;
      
      // Extract main content elements
      const mainElements: PageElement[] = [];
      
      // Get headings
      const headings = document.querySelectorAll('h1, h2, h3');
      headings.forEach(heading => {
        mainElements.push({
          tag: heading.tagName.toLowerCase(),
          text: heading.textContent || '',
          id: heading.id || undefined,
          className: heading.className || undefined
        });
      });
      
      // Get main content
      const mainContent = document.querySelector('main');
      if (mainContent) {
        const paragraphs = mainContent.querySelectorAll('p');
        paragraphs.forEach(p => {
          mainElements.push({
            tag: 'p',
            text: p.textContent || '',
            className: p.className || undefined
          });
        });
      }
      
      // Get navigation links
      const navLinks = document.querySelectorAll('nav a');
      navLinks.forEach(link => {
        mainElements.push({
          tag: 'link',
          text: link.textContent || '',
          role: 'navigation',
          id: link.id || undefined
        });
      });
      
      // Format the extracted content
      const contentText = mainElements
        .map(el => {
          if (el.tag.startsWith('h')) {
            return `## ${el.text}`;
          } else if (el.tag === 'p') {
            return el.text;
          } else if (el.tag === 'link') {
            return `Link: ${el.text}`;
          }
          return el.text;
        })
        .join('\n\n');
      
      return {
        path,
        title,
        content: contentText
      };
    } catch (error) {
      console.error('Error scanning page:', error);
      return {
        path: window.location.pathname,
        title: document.title,
        content: 'Unable to scan page content.'
      };
    }
  },
  
  // Get current page context
  getCurrentPageContext: (): string => {
    const { path, title, content } = pageScannerService.scanCurrentPage();
    
    return `
Current page: ${title}
URL path: ${path}

Page content:
${content}
    `.trim();
  }
}; 