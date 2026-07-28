#!/bin/bash
sed -i 's/{featuresConfig.enableDarkMode && <ThemeToggle \/>}/<div className="hidden sm:flex">{featuresConfig.enableDarkMode \&\& <ThemeToggle \/>}<\/div>/' components/layout/HeaderNav.tsx
