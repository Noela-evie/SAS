const ResourceFilter = ({ resources }) => {
  const [filteredResources, setFilteredResources] = useState(resources);

  const filterResources = (type) => {
    setFilteredResources(type ? resources.filter(r => r.resourceType === type) : resources);
  };

  return (
    <div>
      <button onClick={() => filterResources('')}>All</button>
      <button onClick={() => filterResources('Notes')}>Notes</button>
      <button onClick={() => filterResources('Textbooks')}>Textbooks</button>
      <button onClick={() => filterResources('Pastpapers')}>Past Papers</button>
      <div>
        {filteredResources.map(resource => (
          <div key={resource.id} className="resource-item">
            <h3>{resource.resourceName}</h3>
            <button onClick={() => downloadResource(resource.resourceContent)}>Download</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const downloadResource = async (fileId) => {
  const response = await axios.get(`/api/download/${fileId}`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileId);
  document.body.appendChild(link);
  link.click();
};
