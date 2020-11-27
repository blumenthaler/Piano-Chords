class ChordSerializer
    include FastJsonapi::ObjectSerializer
    attributes :name, :symbols, :structure
    belongs_to :user
  end