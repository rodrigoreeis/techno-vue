const vm = new Vue({
  el: '#app',
  data: {
    products: [],
    product: false,
  },
  filters: {
    formatedPrice(value){
      return value.toLocaleString('pt-br',{
        style: 'currency', 
        currency: 'BRL'
      });
    }
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await fetch('../src/api/products.json');
        const data = await response.json();
        this.products = data;
      } catch (error) {
        console.log('bar', error);
      }
    },
    async fetchProduct(id){
      try {
        const response = await fetch(`../src/api/products/${id}/dados.json`);
        const data = await response.json();
        this.product = data;
        console.log(this.product);
      } catch (error) {
        console.log('bar', error)
      }
    }
  },
  created() {
    this.fetchProducts();
  }
})
