from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in unique_closets/__init__.py
from unique_closets import __version__ as version

setup(
	name="unique_closets",
	version=version,
	description="Overrides and customizations on erpnext for uc company ",
	author="PivotERP",
	author_email="osama.ereksosi@pivoterp.net",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
