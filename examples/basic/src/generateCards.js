const generateCard = (card, dimensions) => {
    return `
      <div 
        class="card card-container"
        style="
          height: ${dimensions.card.height}mm;
          width: ${dimensions.card.width}mm;
          margin-bottom: ${dimensions.card.margin}mm;
          margin-right: ${dimensions.card.margin}mm;
        "
      >
        <div class="card-background">
          <div class="card-frame">
            <div class="frame-header">
              <h1 class="name">${card.name}</h1>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  const generatePage = (cardPage, pageNumber, dimensions) => {
    return `
      <div 
        class="page page-${pageNumber}"
        style="
          height: ${dimensions.page.height}mm;
          width: ${dimensions.page.width}mm;
          max-height: ${dimensions.page.height}mm;
          max-width: ${dimensions.page.width}mm;
          padding: ${dimensions.page.padding}mm;
        "
      >
        ${ 
          cardPage.map( ( card ) => {
              return generateCard(card, dimensions)
            })
            .join(" ")
        }
      </div>
    `
  }
  
  const generateHtmlBody = (dimensions, cardPages) => {
    console.log('foo')
    return `
      <body class="document">
        <div class="pages">
          ${
            cardPages.map( ( cardPage, i ) => {
              return generatePage(cardPage, i, dimensions)
            }).join('')
          }
        </div>
      </body>
    `
  }
  
  
  export default generateHtmlBody