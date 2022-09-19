export default [
  {
    id: 'images',
    title: 'Image',
    sortable: false,
    template: data => {
      return `
        <td class="col">
          <img class="sortable-table-image" alt="Image" src="${data[0].url}">
        </td>`;
    }
  },
  {
    id: 'rating',
    title: 'rating',
    sortable: true,
    sortType: 'number'
  },
  {
    id: 'price',
    title: 'Price',
    sortable: true,
    sortType: 'number'
  },
  {
    id: 'title',
    title: 'Title',
    sortable: true,
    sortType: 'string'
  },
  {
    id: 'description',
    title: 'Description',
    sortable: true,
    sortType: 'string',
    template: description => {
      return `
        <td class="col">
          ${description.slice(0, 50) + '...'}
        </td>`;
    }
  }
];

