interface SearchBarProps {
    value: string
    onSearchChange: (value: string) => void
    label?: string
    placeholder?: string
}

function SearchBar({
    value,
    onSearchChange,
    label = 'Поиск по трекам',
    placeholder = 'Название, исполнитель или жанр',
}: SearchBarProps) {
    return (
      <label className="search-label">
        <span>{label}</span>
        <input
          className="search-input"
          type="search"
          value={value}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
        />
      </label>
    )
}

export default SearchBar