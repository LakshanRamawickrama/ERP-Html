from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_staffprofile_permissions'),
    ]

    operations = [
        migrations.AddField(
            model_name='staffprofile',
            name='password',
            field=models.CharField(default='', max_length=128),
        ),
    ]
