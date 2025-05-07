import "../styles/styleAsset.css";
import assetImage from "../assets/asset-preview.jpg"; // usa tu imagen aquí

function AssetPage() {
  return (
    <div className="asset-page">
      <div className="asset-main">
        <div className="asset-image-section">
          <img src={assetImage} alt="Asset preview" className="main-image" />
          <div className="thumbnail-row">
            <img src={assetImage} className="thumbnail" alt="thumb" />
            <img src={assetImage} className="thumbnail" alt="thumb" />
            <img src={assetImage} className="thumbnail" alt="thumb" />
          </div>
        </div>

        <div className="asset-info-section">
          <div className="publisher">Angel Fernandes</div>
          <h1 className="title">Ancient Middle East Market – Environment Asset Pack</h1>
          <div className="categories">
            <span className="tag">Environments</span>
            <span className="tag">Towns & Villages</span>
          </div>
          <div className="license">
            <label htmlFor="license">License:</label>
            <select id="license">
              <option>From €160.02 to €266.72</option>
            </select>
          </div>
          <div className="buttons">
            <button className="buy">Buy now</button>
            <button className="add-to-cart">Add to cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssetPage;
