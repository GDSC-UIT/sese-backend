const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubcategorySchema = new Schema({
  name: { type: String, unique: true, required: [true, 'Please enter name!'] },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Subcategory must belong to a category'],
  },
  params: [
    new Schema({
      param: String,
      label: {
        type: String,
        required: [true, 'Nhập tên loại'],
      },
      required: { type: Boolean, default: false },
      type: {
        type: String,
        enum: ['dropdown', 'chip', 'string', 'textarea', 'number'],
      },
      options: [
        {
          label: String,
        },
      ],
    }),
  ],
});

module.exports = mongoose.model('Subcategory', SubcategorySchema);
