import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Papa from 'papaparse';
import './styles.css'; // Ensure CSS is imported

const InventoryTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [editRow, setEditRow] = useState(null);
  const [viewRow, setViewRow] = useState(null);
  const [formData, setFormData] = useState({});
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');

  const sections = ['Bags', 'Stationery', 'Toys', 'Kitchen'];
  const files = [
    '/DTD SAMPLE FILE.csv',
    '/DTD SAMPLE FILE1.csv',
    '/DTD SAMPLE FILE2.csv',
    '/DTD SAMPLE FILE3.csv',
  ];

  // Editable fields for the edit modal
  const editableFields = [
    { key: 'DESCRIPTION', label: 'Description', type: 'text' },
    { key: 'ITEM NO.', label: 'Item Number', type: 'text' },
    { key: 'SEC.', label: 'Section', type: 'text' },
    { key: 'COST', label: 'Cost', type: 'number', step: '0.01' },
    { key: 'SALE', label: 'Sale Price', type: 'number', step: '0.01' },
    { key: 'PACKING', label: 'Packing', type: 'text' },
    { key: 'T-PCS', label: 'Total Pieces', type: 'number' },
  ];

  // Fields to display in the view modal
  const viewFields = [
    { key: 'DESCRIPTION', label: 'Description' },
    { key: 'ITEM NO.', label: 'Item Number' },
    { key: 'SEC.', label: 'Section' },
    { key: 'COST', label: 'Cost' },
    { key: 'SALE', label: 'Sale Price' },
    { key: 'PACKING', label: 'Packing' },
    { key: 'T-PCS', label: 'Total Pieces' },
    { key: 'CTN', label: 'Carton' },
    { key: 'WAREHOSE STOCK', label: 'Warehouse Stock' },
    { key: 'ABUDHABI', label: 'Abu Dhabi Stock' },
    { key: 'AJMAN', label: 'Ajman Stock' },
    { key: 'AVENUE', label: 'Avenue Stock' },
    { key: 'AL SAFA', label: 'Al Safa Stock' },
    { key: 'BANIYAS', label: 'Baniyas Stock' },
    { key: 'FAHIDI', label: 'Fahidi Stock' },
    { key: 'SHARJAH', label: 'Sharjah Stock' },
  ];

  // Image mapping based on section
  const getImageForIndex = (fileIndex, rowIndex) => {
    const imageRanges = [
      { start: 1, end: 22 }, // Bags
      { start: 23, end: 43 }, // Stationery
      { start: 44, end: 64 }, // Toys
      { start: 65, end: 98 }, // Kitchen
    ];
    const { start, end } = imageRanges[fileIndex];
    const imageIndex = start + rowIndex;
    if (imageIndex < start || imageIndex > end || imageIndex > 98) {
      return '/image.png';
    }
    return `/image copy ${imageIndex - 1}.png`;
  };

  // Load CSV files
  useEffect(() => {
    const loadData = async () => {
      try {
        const responses = await Promise.all(
          files.map((file) =>
            fetch(file).then((res) => {
              if (!res.ok) throw new Error(`Failed to fetch ${file}`);
              return res.text();
            })
          )
        );

        const allData = responses.map((text, i) => {
          const result = Papa.parse(text, { header: true, skipEmptyLines: true });
          return result.data.map((row, index) => ({
            ...row,
            IMAGE: getImageForIndex(i, index),
            COUNT: index + 1,
          }));
        });

        setData(allData);
        setFilteredData(allData[0] || []);
      } catch (error) {
        console.error('Error loading CSV files:', error);
        setData(files.map(() => []));
        setFilteredData([]);
      }
    };
    loadData();
  }, []);

  // Update filtered data
  useEffect(() => {
    const currentData = data[currentPage] || [];
    if (searchTerm.trim() === '') {
      setFilteredData(currentData);
    } else {
      const filtered = currentData.filter((row) =>
        row.DESCRIPTION?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [currentPage, searchTerm, data]);

  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex);
    setSearchTerm('');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleImageClick = (imageSrc) => {
    setModalImageSrc(imageSrc);
    setShowImageModal(true);
  };

  const handleEditClick = (row, rowIndex) => {
    setEditRow({ row, sectionIndex: currentPage, rowIndex });
    setFormData({ ...row });
  };

  const handleViewClick = (row) => {
    setViewRow(row);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!editRow) return;

    const { sectionIndex, rowIndex } = editRow;

    // Validate numeric fields
    const validatedFormData = { ...formData };
    editableFields.forEach((field) => {
      if (field.type === 'number' && validatedFormData[field.key]) {
        const value = parseFloat(validatedFormData[field.key]);
        validatedFormData[field.key] = isNaN(value) ? '' : value.toString();
      }
    });

    // Update data state
    setData((prevData) => {
      const newData = [...prevData];
      newData[sectionIndex] = [...newData[sectionIndex]];
      newData[sectionIndex][rowIndex] = {
        ...validatedFormData,
        IMAGE: newData[sectionIndex][rowIndex].IMAGE,
        COUNT: rowIndex + 1,
      };
      return newData;
    });

    // Update filteredData state
    setFilteredData((prevFiltered) => {
      const newFiltered = [...prevFiltered];
      newFiltered[rowIndex] = {
        ...validatedFormData,
        IMAGE: newFiltered[rowIndex].IMAGE,
        COUNT: rowIndex + 1,
      };
      return newFiltered;
    });

    setEditRow(null);
    setFormData({});
  };

  const handleEditModalClose = () => {
    setEditRow(null);
    setFormData({});
  };

  const handleViewModalClose = () => {
    setViewRow(null);
  };

  const headers = [
    'COUNT',
    'REF.',
    'IMAGE',
    'ITEM NO.',
    'SEC.',
    'DESCRIPTION',
    'CTN',
    'PACKING',
    'T-PCS',
    'COST',
    'TOTAL',
    'SALE',
    'WAREHOSE STOCK',
    'ABUDHABI',
    'AJMAN',
    'AVENUE',
    'AL SAFA',
    'BANIYAS',
    'FAHIDI',
    'SHARJAH',
    'ACTION',
  ];

  return (
    <div className="inventory-container">
      <h1 className="display-4 font-weight-bold mb-4">Warehouse Inventory</h1>

      <div className="mb-4 position-relative">
        <Form.Control
          type="text"
          className="form-control-lg modern-search"
          placeholder="🔍 Search by description..."
          value={searchTerm}
          onChange={handleSearch}
          aria-label="Search inventory"
        />
      </div>

      <div className="table-wrapper">
        <table className="table table-hover table-bordered">
          <thead className="thead-dark">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={`font-weight-bold ${header === 'SALE' ? 'text-danger' : ''}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((header, colIndex) => (
                  <td
                    key={colIndex}
                    className={`font-weight-bold ${header === 'SALE' ? 'text-danger' : ''}`}
                  >
                    {header === 'IMAGE' ? (
                      <img
                        src={row[header]}
                        alt={row.DESCRIPTION || 'Item'}
                        className="item-image"
                        onClick={() => handleImageClick(row[header])}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleImageClick(row[header])}
                      />
                    ) : header === 'ACTION' ? (
                      <div className="d-flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          className="edit-btn"
                          onClick={() => handleEditClick(row, rowIndex)}
                          aria-label={`Edit item ${row.DESCRIPTION || 'unknown'}`}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="info"
                          size="sm"
                          className="view-btn"
                          onClick={() => handleViewClick(row)}
                          aria-label={`View item ${row.DESCRIPTION || 'unknown'}`}
                        >
                          View
                        </Button>
                      </div>
                    ) : (
                      row[header] || ''
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <nav aria-label="Page navigation" className="mt-4">
        <ul className="pagination justify-content-center">
          {data.map((_, index) => (
            <li key={index} className={`page-item ${currentPage === index ? 'active' : ''}`}>
              <Button
                className="page-link"
                onClick={() => handlePageChange(index)}
                aria-label={`Go to ${sections[index]} section`}
              >
                {sections[index]}
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Image Modal */}
      <Modal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        centered
        size="lg"
        aria-labelledby="imageModalLabel"
      >
        <Modal.Header closeButton>
          <Modal.Title id="imageModalLabel">Item Image</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img src={modalImageSrc} alt="Item Image" className="img-fluid" />
        </Modal.Body>
      </Modal>

      {/* Edit Modal */}
      <Modal
        show={!!editRow}
        onHide={handleEditModalClose}
        size="lg"
        aria-labelledby="editModalLabel"
      >
        <Modal.Header closeButton>
          <Modal.Title id="editModalLabel">Edit Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <div className="row">
              {editableFields.map((field) => (
                <div className="col-md-6 mb-3" key={field.key}>
                  <Form.Group controlId={field.key}>
                    <Form.Label>{field.label}</Form.Label>
                    <Form.Control
                      type={field.type}
                      name={field.key}
                      value={formData[field.key] || ''}
                      onChange={handleFormChange}
                      placeholder={`Enter ${field.label}`}
                      step={field.step}
                      required={field.type === 'text'}
                    />
                  </Form.Group>
                </div>
              ))}
            </div>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleEditModalClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      {/* View Modal */}
      <Modal
        show={!!viewRow}
        onHide={handleViewModalClose}
        size="lg"
        aria-labelledby="viewModalLabel"
        className="view-modal"
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title id="viewModalLabel">Item Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewRow && (
            <div className="row">
              <div className="col-md-4 text-center">
                <img
                  src={viewRow.IMAGE}
                  alt={viewRow.DESCRIPTION || 'Item'}
                  className="img-fluid view-image mb-3"
                />
              </div>
              <div className="col-md-8">
                <div className="details-grid">
                  {viewFields.map((field) => (
                    <div key={field.key} className="detail-item">
                      <strong>{field.label}:</strong>
                      <span>{viewRow[field.key] || 'N/A'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleViewModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InventoryTable;