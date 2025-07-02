const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TEMPLATE_PATH = './ios/LocalizationInfoPlist.xml';
const TARGET_PATH = './node_modules/.generated/ios/Info.plist';

// Check if the target directory exists
if (!fs.existsSync(path.resolve('./node_modules'))) {
  console.log('iOS generated files not found, skipping localization merge');
  process.exit(0);
}

// Check if files exist
if (!fs.existsSync(TARGET_PATH)) {
  console.error(`Target Info.plist not found at ${TARGET_PATH}`);
  process.exit(1);
}

if (!fs.existsSync(TEMPLATE_PATH)) {
  console.error(`Template file not found at ${TEMPLATE_PATH}`);
  process.exit(1);
}

console.log(`Merging localizations from ${TEMPLATE_PATH} into ${TARGET_PATH}`);

try {
  // Use PlistBuddy to merge the localizations
  execSync(
    `/usr/libexec/PlistBuddy -c "Merge ${TEMPLATE_PATH}" "${TARGET_PATH}"`
  );

  console.log('Successfully added localizations to Info.plist');
  const languages = execSync(
    `/usr/libexec/PlistBuddy -c "Print :CFBundleLocalizations" "${TARGET_PATH}"`
  );
  console.log('Supported languages:', languages.toString());
} catch (error) {
  console.error('Failed to merge localizations:', error.message);
  process.exit(1);
}
