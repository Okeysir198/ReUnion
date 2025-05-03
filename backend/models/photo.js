// Photo Model for Photo Uploads
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const photosFilePath = path.join(__dirname, '../data/photos.json');

// Helper functions
const getPhotos = () => {
  try {
    const fileData = fs.readFileSync(photosFilePath);
    return JSON.parse(fileData);
  } catch (error) {
    return [];
  }
};

const savePhotos = (photos) => {
  fs.writeFileSync(photosFilePath, JSON.stringify(photos, null, 2));
};

// Photo Model
class Photo {
  constructor(photoData) {
    this.id = photoData.id || uuidv4();
    this.userId = photoData.userId || null;
    this.uploaderName = photoData.uploaderName;
    this.uploaderEmail = photoData.uploaderEmail;
    this.filename = photoData.filename;
    this.originalName = photoData.originalName;
    this.path = photoData.path;
    this.mimetype = photoData.mimetype;
    this.size = photoData.size;
    this.caption = photoData.caption || '';
    this.year = photoData.year || 2005;
    this.approved = photoData.approved || false;
    this.uploadDate = photoData.uploadDate || new Date().toISOString();
  }

  // Save the photo to the JSON file
  async save() {
    const photos = getPhotos();
    
    // Check if photo already exists (for update case)
    const existingPhotoIndex = photos.findIndex(photo => photo.id === this.id);
    
    if (existingPhotoIndex >= 0) {
      // Update existing photo
      photos[existingPhotoIndex] = this;
    } else {
      // Add new photo
      photos.push(this);
    }
    
    savePhotos(photos);
    return this;
  }

  // Find a photo by ID
  static findById(id) {
    const photos = getPhotos();
    return photos.find(photo => photo.id === id) || null;
  }

  // Find photos by query
  static find(query = {}) {
    const photos = getPhotos();
    
    // Filter based on approval status if specified
    if (query.approved !== undefined) {
      return photos.filter(photo => photo.approved === query.approved);
    }
    
    return photos;
  }

  // Delete a photo
  async remove() {
    const photos = getPhotos();
    const updatedPhotos = photos.filter(photo => photo.id !== this.id);
    savePhotos(updatedPhotos);
    return this;
  }
}

module.exports = Photo;