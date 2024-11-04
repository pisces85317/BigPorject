namespace BigPorject.Models
{
    public class Product
    {
        public int id { get; set; }
        public string? productid { get; set; }
        public string? productname { get; set; }
        public int price { get; set; }
        public string? category { get; set; }
        public string? uom { get; set; }
        public string? country {  get; set; }
        public string? baking { get; set; }
        public string? flavor { get; set; }
        public int fragrance { get; set; }
        public int sour {  get; set; }
        public int bitter { get; set; }
        public int sweet {  get; set; }
        public int strong { get; set; }
        public string? method {  get; set; }
        public string? Img {  get; set; }
        public Product(int id, string? productid, string? productname, int price, string? category, string? uom, string? country, string? baking, string? flavor, int fragrance, int sour, int bitter, int sweet, int strong, string? method, string? img)
        {
            this.id = id;
            this.productid = productid;
            this.productname = productname;
            this.price = price;
            this.category = category;
            this.uom = uom;
            this.country = country;
            this.baking = baking;
            this.flavor = flavor;
            this.fragrance = fragrance;
            this.sour = sour;
            this.bitter = bitter;
            this.sweet = sweet;
            this.strong = strong;
            this.method = method;
            this.Img = img;
        }
    }
}
