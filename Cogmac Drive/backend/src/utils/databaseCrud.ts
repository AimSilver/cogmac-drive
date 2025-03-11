import { fileModel } from "../models/file.model";

export const crudOperations = {
  deleteById: () => {
    fileModel.findByIdAndDelete;
  },
};
