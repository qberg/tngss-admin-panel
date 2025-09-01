interface ToggleButtonProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  label?: string
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ enabled, onChange, label }) => (
  <div className="flex items-center space-x-3">
    {label && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>}
    <button
      type="button"
      className={`${
        enabled ? 'bg-[#18BFDB]' : 'bg-gray-200 dark:bg-gray-600'
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
      onClick={() => onChange(!enabled)}
    >
      <span className="sr-only">Toggle table view</span>
      <span
        className={`${
          enabled ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  </div>
)

export default ToggleButton
