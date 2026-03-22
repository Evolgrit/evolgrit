Pod::Spec.new do |s|
  s.name         = "EvolgritVision"
  s.version      = "0.0.1"
  s.summary      = "Evolgrit Vision utilities"
  s.license      = { :type => "MIT" }
  s.author       = { "Evolgrit" => "dev@evolgrit.com" }
  s.platforms    = { :ios => "13.0" }
  s.source       = { :git => "", :tag => s.version.to_s }
  s.source_files = "ios/**/*.{swift}"
  s.dependency "ExpoModulesCore"
end
