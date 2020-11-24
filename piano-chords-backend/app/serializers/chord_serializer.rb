class ChordSerializer
    include FastJsonapi::ObjectSerializer
    attributes :name, :symbols, :structure
    # has_many :users
  end